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
          nodejs
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
