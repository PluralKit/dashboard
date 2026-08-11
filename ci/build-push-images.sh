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

    skopeo --insecure-policy copy "docker-archive:./result-$img" "docker://$repo:$TAG"
    skopeo --insecure-policy copy "docker://$repo:$TAG" "docker://$repo:$branch"
    if [ "$BRANCH" == "main" ]; then
        skopeo --insecure-policy copy "docker://$repo:$TAG" "docker://$repo:latest"
    fi
done
