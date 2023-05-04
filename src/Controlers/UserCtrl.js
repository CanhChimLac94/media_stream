var MUser = require("../Models/User");
var bcrypt = require('bcrypt');
const { UnsupportedMediaType } = require("http-errors");

function coppy_data(obj, attribute) {
    if (undefined == obj || null == obj || typeof obj != 'object') return null;
    if (undefined == attribute || null == attribute || attribute.length <= 0) return obj;
    let o = {};
    attribute.forEach((t) => {
        o[t] = obj[t];
    });
    return o;
}

module.exports = function(db) {
    User = MUser(db);

    return {
        getUser: function(req, res, next) {
            var users = null;
            User.find({}, "", function(err, us) {
                users = us;
                return res.json(users);
            });
        },
        submitUser: async function(req, res, next) {
            var data = req.body;
            let pass = data.password;
            let salt = bcrypt.genSaltSync(11);
            let pass_hash = bcrypt.hashSync(pass, salt);

            // await User.deleteMany({});

            let users = await User.find({
                $or: [
                    { user_name: data.username },
                    { email: data.username }
                ]
            }, "", null).exec();
            if (users.length > 0) {
                return res.json({
                    status: "fail",
                    msg: "Tên đăng nhập hoặc email đã được dăng ký",
                });
            }
            let u = new User({
                user_name: data.username,
                full_name: data.fullname,
                email: data.email,
                password: pass_hash,
                active: true,
                code_authentication: "",
                info: "",
            });
            await u.save();
            u.password = undefined;

            return res.json({
                status: "ok",
                msg: "",
                user: u
            });
        },
        authentication: async function(req, res, next) {
            let data = req.body;
            var user = await User.findOne({
                $or: [
                    { user_name: data.username },
                    { email: data.username }
                ]
            }, "", null).exec();
            if (undefined != user && null != user) {
                if (bcrypt.compareSync(data.password, user.password)) {
                    return res.json({
                        status: "ok",
                        msg: "",
                        active: true,
                        user: {
                            id: user._id,
                            username: user.user_name,
                            fullname: user.full_name,
                            code_authentication: user.code_authentication,
                            info: user.info,
                        }
                    });
                } else {
                    return res.json({
                        status: "fail",
                        msg: "Mật khẩu đăng nhập không đúng",
                        active: false,
                        user: null
                    });
                }
            }
            return res.json({
                status: "fail",
                msg: "Tên đăng nhập hoặc email không tồn tại",
                active: false,
                user: null
            });
        },

    }
};