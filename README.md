# Image Hosting Server

This repo is mostly written by GPT-4 (under my instruction).

## Install & Deploy

1. install dependencies: `npm install` or `yarn`
   - if package `sharp` hard to install due to network condition
   - set:
     - `npm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"`
     - `npm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"`
   - then `npm install` or `yarn`
2. development/debugging/feature adding: `npm run dev` or `yarn dev`
3. deployment
   1. Put SSL key `(xxx.pem, xxx.key)` under `./keys`
   2. `npm run start` or `yarn start`

Recommend: Use `pm2`

## Todo

- [ ] Upload multiple images at once
- [ ] Uploading folder backup
- [ ] Maybe add a standalone upload button in image_list page

---

[Contact Me](mailto:jason.yang98@foxmail.com)
