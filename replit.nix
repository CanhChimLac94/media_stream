{ pkgs }: {
    deps = [
        pkgs.docker-client
        pkgs.iproute2
        pkgs.nodejs-16_x
        pkgs.cowsay
    ];
}
