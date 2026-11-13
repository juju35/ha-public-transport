#!/usr/bin/env bash
# Downloads the network logos (SVG) into custom_components/public_transport/frontend/logos/.
#
# Each logo is the "logo image" (P154) of the network's Wikidata item, found from its French Wikipedia article, and
# downloaded from Wikimedia Commons. GTFS-RT networks are named after their transport.data.gouv.fr dataset
# (gtfs-<slug>.svg, as the integration looks them up), the slug found by the dataset's title in the catalogue.
# Files that are not plain SVG (scripts, event handlers, embedded HTML) are refused: the card shows them in an <img>,
# but the integration also serves them as files.
#
# Needs curl and jq. Run from the repository root: scripts/fetch-logos.sh
set -u
LOGOS=custom_components/public_transport/frontend/logos
AGENT="ha-public-transport (https://github.com/juju35/ha-public-transport)"
mkdir -p "$LOGOS"
failed=0

download() {  # $1 = file name without .svg, $2 = Commons file name
  local target="$LOGOS/$1.svg" tmp
  tmp=$(mktemp)
  if ! curl -sfL -A "$AGENT" -o "$tmp" \
    "https://commons.wikimedia.org/wiki/Special:FilePath/$(jq -rn --arg f "$2" '$f|@uri')"; then
    echo "✗ $1: download of $2 failed"; rm -f "$tmp"; return 1
  fi
  if ! grep -q "<svg" "$tmp" || grep -qiE "<script|<foreignObject|[[:space:]]on[a-z]+=|javascript:" "$tmp"; then
    echo "✗ $1: $2 is not a plain SVG, refused"; rm -f "$tmp"; return 1
  fi
  mv "$tmp" "$target" && chmod 644 "$target" && echo "✓ $1.svg ← $2"
}

commons_logo() {  # $1 = French Wikipedia article → Commons file name of the Wikidata logo (P154), SVG only
  local qid file
  qid=$(curl -sfG -A "$AGENT" https://fr.wikipedia.org/w/api.php --data-urlencode action=query \
    --data-urlencode prop=pageprops --data-urlencode "titles=$1" --data-urlencode format=json \
    | jq -r '.query.pages[].pageprops.wikibase_item // empty')
  [ -n "$qid" ] || return 1
  file=$(curl -sfG -A "$AGENT" https://www.wikidata.org/w/api.php --data-urlencode action=wbgetclaims \
    --data-urlencode "entity=$qid" --data-urlencode property=P154 --data-urlencode format=json \
    | jq -r '.claims.P154[0].mainsnak.datavalue.value // empty')
  case "$file" in *.svg|*.SVG) echo "$file" ;; *) return 1 ;; esac
}

logo() {  # $1 = file name, $2 = Wikipedia article, $3 = verified Commons fallback (optional)
  local file
  if file=$(commons_logo "$2"); then
    download "$1" "$file" && return 0
  fi
  if [ -n "${3:-}" ]; then
    download "$1" "$3" && return 0
  fi
  echo "✗ $1: no SVG logo for \"$2\""
  failed=$((failed + 1))
}

CATALOG=$(mktemp)
curl -sf -A "$AGENT" https://transport.data.gouv.fr/api/datasets -o "$CATALOG" || echo "✗ catalogue unreachable"

gtfs_logo() {  # $1 = words of the dataset title, $2 = Wikipedia article
  local slug
  slug=$(jq -r --arg q "$1" '[.[] | select(.type == "public-transit")
      | select((.title | ascii_downcase) | contains($q | ascii_downcase))
      | select(any(.resources[]?; (.format | ascii_downcase) == "gtfs-rt"))][0].slug // empty' "$CATALOG" 2>/dev/null)
  if [ -z "$slug" ]; then
    echo "✗ $1: no GTFS-RT dataset in the catalogue"
    failed=$((failed + 1))
    return
  fi
  logo "gtfs-$slug" "$2"
}

# Dedicated providers
logo star "Service des transports en commun de l'agglomération rennaise" "Logo_Bus_Rennes.svg"
logo idfm "Île-de-France Mobilités"
logo tcl "TCL (Réseau de transports en commun)"
logo cts "Compagnie des transports strasbourgeois" "Logo_Compagnie_des_transports_strasbourgeois.svg"

# Big GTFS-RT networks
gtfs_logo "Tisséo" "Tisséo"
gtfs_logo "TaM" "Transports de l'agglomération de Montpellier"
gtfs_logo "TBM" "Transports Bordeaux Métropole"
gtfs_logo "Naolib" "Naolib"
gtfs_logo "Ilévia" "Ilévia"

rm -f "$CATALOG"
ls -l "$LOGOS"
echo "$failed logo(s) missing"
