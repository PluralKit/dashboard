{ flake-parts-lib, ... }:
{
  options.perSystem = flake-parts-lib.mkPerSystemOption (
    { lib, ... }: {
      options.pluralkit = {
        webApps = lib.mkOption {
          description = "NodeJS web apps to package by name";
          default = { };
          type = lib.types.attrsOf (
            lib.types.submodule (
              { name, ... }:
              {
                options = {
                  adapter = lib.mkOption {
                    description = "SvelteKit adapter used";
                    type = lib.types.str;
                    default = "node";
                  };
                  workspaces = lib.mkOption {
                    description = "The PNPM workspaces used";
                    type = lib.types.listOf lib.types.str;
                  };
                  buildInputs = lib.mkOption {
                    description = "Extra buildInputs for this app";
                    type = lib.types.listOf lib.types.package;
                    default = [ ];
                  };
                  nativeBuildInputs = lib.mkOption {
                    description = "Extra nativeBuildInputs for this app";
                    type = lib.types.listOf lib.types.package;
                    default = [ ];
                  };
                  addlPkgs = lib.mkOption {
                    description = "Extra packages to include in the docker image";
                    type = lib.types.listOf lib.types.package;
                    default = [ ];
                  };
                };
              }
            )
          );
        };
      };
    }
  );
}
