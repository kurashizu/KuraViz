# Upload Guide

task name: Upload the video to Bilibili

You should use `playwright` mcp, and follow the steps below to upload a video to Bilibili.
If any errors occur during upload, log the error message and retry up to 3 times before giving up.

## Pre-upload Checklist
1. Verify video file exists: `ls -lh /home/krsz/Projects/videos/<project>/video.mp4`
2. Generate thumbnail image in `/home/krsz/Projects/videos/<project>/thumbnail.jpg` using API:

```bash
cd /home/krsz/Projects/videos/<project>

curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/black-forest-labs/flux-1-schnell  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "prompt": "REPLACE_WITH_VIDEO_CONTENT_DESCRIPTION, cinematic, high quality, 480p 4:3, thumbnail, no text", "seed": "1" }' \
  -o response.json
  
 jq -r '.result.image' response.json | base64 -d > thumbnail.jpg
```

3. Prepare your content:
   - Title: Chinese, 10-50 characters
   - Description: Chinese, 20-500 characters
   - Tags: 3-10 relevant tags (e.g., 编程, AI, 教程)
   - Category: appropriate sub-category

## Upload Steps

1. Open Firefox and navigate to:
   ```
   https://member.bilibili.com/platform/upload/video/frame?spm_id_from=333.1007.top_bar.upload
   ```
   Wait for page to fully load (networkidle).

2. Find and click `上传视频` button to upload the video file.

3. You do not need to wait for the video to finish uploading, just go ahead. While video uploads in background, fill in metadata:
   - **标题** field: type your title
   - **封面设置** field: click then a dialog will appear, click `上传封面` to upload the generated thumbnail.jpg sync all filed with the same image.
   - **创作声明** field: choose "内容无需标注"
   - **简介** field: type your description
   - **分区** dropdown: select appropriate category
   - **标签** field: unselect default tags in "推荐标签" if possible, then type your tags one by one and press Enter after each
   - **参与话题** field: select a topic if relevant, otherwise leave it blank

4. After metadata filled and video shows "上传完成" or similar:
   - Click `立即投稿` button to submit

## Success Criteria
- Page shows "投稿成功" or similar success message
- Video appears in your Bilibili creator center
- Close any junk tabs opened during process

## Cleanup
- Close the browser after this process is complete to free up resources.
