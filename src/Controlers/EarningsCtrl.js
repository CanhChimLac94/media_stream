var MEarnings = require("../Models/Earnings");

module.exports = function(db) {
    Earnings = MEarnings(db);

    async function get_datas(uid, year, month) {
        let lst_ear = await Earnings.find({
            uid: uid,
            year: year,
            month: month
        }, "", null).sort({ date: 1 });
        return lst_ear;
    };

    return {
        getList: async function(req, res, next) {
            let data = req.body;
            let out_datas = await get_datas(data.uid, data.year, data.month);
            return res.json({
                status: "ok",
                msg: "",
                datas: out_datas,
            });
        },
        submitDate: async function(req, res, next) {
            let data = req.body;
            let action = "Thêm";
            let d = new Earnings({
                uid: data.uid,
                year: data.year,
                month: data.month,
                date: data.date,
                cost: data.cost,
                action: data.action,
                detail: data.detail
            });
            if (undefined != data._id && null != data._id && "" != data._id) {
                // update earnings
                action = "Sửa";
                d = await Earnings.findOne({ _id: data._id }, "", null);
                d.date = data.date;
                d.cost = data.cost;
                d.detail = data.detail;
            }
            await d.save();
            let lst_ea = await await get_datas(data.uid, data.year, data.month);
            return res.json({
                status: "ok",
                msg: action + " " + data.action + " thành công",
                datas: lst_ea
            });
        },
        delete: async function(req, res, next) {
            let data = req.body;
            await Earnings.deleteOne({
                uid: data.uid,
                _id: data.id
            }, null);
            let lst_earnings = await get_datas(data.uid, data.year, data.month);
            return res.json({
                status: "ok",
                msg: "Đã xóa mục thu, chi",
                datas: lst_earnings,
            });
        },


    };
}