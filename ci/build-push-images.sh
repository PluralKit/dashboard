#! /usr/bin/env nix
#! nix shell nixpkgs#skopeo nixpkgs#jq --command bash
set -euo pipefail

owner=$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')
branch=$(echo "$REF_NAME" | tr '/' '-')

skopeo login ghcr.io --username "$ACTOR" --password-stdin <<< "$GH_TOKEN"

images=$(nix eval --json .#packages.x86_64-linux \
    --apply 'ps: builtins.filter (n: builtins.match ".*-image" n != null) (builtins.attrNames ps)' \
    | jq -r '.[]')

for img in $images; do
    name="${img%-image}"
    repo="ghcr.io/$owner/$name"

    nix build ".#$img" --out-link "result-$img"
    ./result-$img > "$img.tar"

    skopeo --insecure-policy copy "docker-archive:./$img.tar" "docker://$repo:$TAG"
    skopeo --insecure-policy copy "docker://$repo:$TAG" "docker://$repo:$branch"
    if [ "$BRANCH" == "main" ]; then
        skopeo --insecure-policy copy "docker://$repo:$TAG" "docker://$repo:latest"
    fi

    rm -f "$img.tar"
done
