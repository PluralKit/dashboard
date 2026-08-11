{
  description = "flake for pluralkit web";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixpkgs-unstable/nixexprs.tar.xz";
    parts.url = "github:hercules-ci/flake-parts";
    systems.url = "github:nix-systems/default";
    # misc
    treefmt.url = "github:numtide/treefmt-nix";
    treefmt.inputs.nixpkgs.follows = "nixpkgs";
    flake-compat.url = "https://flakehub.com/f/edolstra/flake-compat/1.tar.gz";
  };

  outputs =
    inp:
    inp.parts.lib.mkFlake { inputs = inp; } {
      systems = import inp.systems;
      imports = [
        inp.treefmt.flakeModule
        ./nix
      ];
      perSystem =
        {
          pkgs,
          system,
          ...
        }:
        {
          # is there an easier way to do this?
          _module.args.pkgs = inp.nixpkgs.legacyPackages.${system}.extend (
            final: prev: {
              nodejs = final.nodejs_24;
              nodejs-slim = final.nodejs-slim_24;
              pnpm = final.pnpm_11;
            }
          );
          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
          };

          pluralkit.webApps = {
            dashboard = {
              adapter = "node";
              workspaces = [
                "pluralkit-web"
                "@pluralkit-web/dashboard"
                "@pluralkit-web/config"
                "@pluralkit-web/ui"
              ];
            };
          };
        };
    };
}
