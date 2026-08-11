{ ... }:
{
  perSystem =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      nodeApps = lib.filterAttrs (_: cfg: cfg.adapter == "node") config.pluralkit.webApps;
    in
    {
      packages = lib.mapAttrs' (
        name: conf:
        lib.nameValuePair "${name}-image" (
          pkgs.dockerTools.streamLayeredImage {
            name = "${name}";
            tag = "latest";
            contents = [ pkgs.dockerTools.caCertificates ] ++ conf.addlPkgs;
            config = {
              Cmd = [ "${config.packages.${name}}/bin/${name}" ];
              Env = [
                "NODE_ENV=production"
                "PORT=3000"
                "HOST=0.0.0.0"
              ];
              ExposedPorts."3000/tcp" = { };
              WorkingDir = "/";
            };
          }
        )
      ) nodeApps;
    };
}
