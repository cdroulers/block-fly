param (
  [string]$UserName,
  [switch]$SkipBuild
)

function Main() {
  if (-not $SkipBuild) {
    npm install
    npm run build
  }

  scp -o user=$UserName -r ./dist/* cdroulers.com:/home/cdroulers/all_subdomains/apps.cdroulers.com/block-fly
}

Main;
