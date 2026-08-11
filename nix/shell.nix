{ ... }:
{
  perSystem =
    {
      config,
      pkgs,
      pkLib,
      ...
    }:
    let
      web = pkgs.mkShellNoCC {
        buildInputs = with pkgs; [
          nodejs_24
          pnpm
        ];
      };
    in
    {
      devShells = {
        default = web;
      };
    };
}
