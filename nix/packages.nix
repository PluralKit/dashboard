{ inputs, ... }:
{
  perSystem =
    {
      lib,
      config,
      pkgs,
      ...
    }:
    {
      packages = lib.mapAttrs (
        name: webApp:
        let
          hashes = lib.importJSON ../pnpm-hashes.json;

          pname = "@pluralkit-web/${name}";
          version = inputs.self.rev or inputs.self.dirtyRev or "dev";
          src = inputs.self;
          adapter = webApp.adapter;
          pnpmWorkspaces = webApp.workspaces;
        in
        pkgs.stdenv.mkDerivation (finalAttrs: {
          inherit
            pname
            version
            src
            pnpmWorkspaces
            ;

          env = {
            COMMIT_HASH = version;
          };
          nativeBuildInputs =
            with pkgs;
            [
              nodejs
              pnpm
              pnpmConfigHook
            ]
            ++ lib.optional (adapter == "node") pkgs.makeBinaryWrapper
            ++ webApp.nativeBuildInputs;
          buildInputs = webApp.buildInputs;

          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs)
              pname
              version
              src
              pnpmWorkspaces
              ;
            fetcherVersion = 4;
            hash = hashes.${pname};
          };

          buildPhase = ''
            runHook preBuild
            pnpm --filter ${pname} exec svelte-kit sync
            pnpm --filter "${pname}..." build
            runHook postBuild
          '';

          installPhase =
            if adapter == "static" then
              ''
                runHook preInstall
                cp -r apps/${name}/build $out
                runHook postInstall
              ''
            else
              ''
                runHook preInstall
                mkdir -p $out/share/${name}
                cp -r apps/${name}/build/* $out/share/${name}/

                makeBinaryWrapper ${lib.getExe pkgs.nodejs-slim} $out/bin/${name} \
                  --add-flags "$out/share/${name}/index.js"
                runHook postInstall
              '';

          meta.mainProgram = lib.optionalString (adapter == "node") pname;
        })
      ) config.pluralkit.webApps;
    };
}
