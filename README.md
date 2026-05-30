# GBCCA Chinese Music Ensemble — Instrument Visual Guide

An interactive reference guide to the instruments of a Chinese music ensemble, built in collaboration with Claude with Vite + React and deployed to GitHub Pages.

**Live site:** https://coldnebo.github.io/gbcca-instruments/

## Development

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up
```

Then open http://localhost:5173. The dev server hot-reloads on save. `node_modules` is kept inside the container so there's no conflict with Windows file paths.

## Build & Deploy

Pushing to `main` automatically builds and deploys to GitHub Pages via the workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

> **First-time setup:** In your GitHub repo settings → Pages, set the source to **GitHub Actions**.

## Image Credits

Instrument photos are fetched at runtime from [Wikipedia](https://www.wikipedia.org/) via the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) and are used under their respective [Creative Commons](https://creativecommons.org/licenses/by-sa/4.0/) licenses. Each card links to the source Wikipedia article where full image attribution and license details can be found.

| Instrument | Chinese | Wikipedia Article |
|---|---|---|
| Gaohu | 高胡 | [Gaohu](https://en.wikipedia.org/wiki/Gaohu) |
| Erhu | 二胡 | [Erhu](https://en.wikipedia.org/wiki/Erhu) |
| Zhonghu | 中胡 | [Zhonghu](https://en.wikipedia.org/wiki/Zhonghu) |
| Pipa | 琵琶 | [Pipa](https://en.wikipedia.org/wiki/Pipa) |
| Liuqin | 柳琴 | [Liuqin](https://en.wikipedia.org/wiki/Liuqin) |
| Ruan | 阮 | [Ruan (instrument)](https://en.wikipedia.org/wiki/Ruan_(instrument)) |
| Yangqin | 揚琴 | [Yangqin](https://en.wikipedia.org/wiki/Yangqin) |
| Guzheng | 古箏 | [Guzheng](https://en.wikipedia.org/wiki/Guzheng) |
| Sheng | 笙 | [Sheng (instrument)](https://en.wikipedia.org/wiki/Sheng_(instrument)) |
| Dizi | 笛子 | [Dizi (instrument)](https://en.wikipedia.org/wiki/Dizi_(instrument)) |
| Suona | 嗩吶 | [Suona](https://en.wikipedia.org/wiki/Suona) |
| Cello | 大提琴 | [Cello](https://en.wikipedia.org/wiki/Cello) |
| Double Bass | 低音大提 | [Double bass](https://en.wikipedia.org/wiki/Double_bass) |
| Percussion | 打擊 | [Chinese percussion instruments](https://en.wikipedia.org/wiki/Chinese_percussion_instruments) |
