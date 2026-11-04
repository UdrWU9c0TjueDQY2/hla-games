from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
r=Path(__file__).parent
font=lambda n:ImageFont.truetype(str(r/'archivo-800.ttf'),n)
for w,h,name in [(1200,630,'og.png'),(1000,1500,'pin-1.png')]:
 im=Image.new('RGB',(w,h),'#071a26');d=ImageDraw.Draw(im);d.rectangle((0,0,w,90),fill='#9be9d3');d.text((50,27),'SUMBRISKA / PRACTICE NOTES',font=font(26),fill='#092a31')
 if w>h:
  d.multiline_text((55,135),'Before you flip it,\npredict it.',font=font(80),spacing=10,fill='#e5f1ec');d.text((55,410),'PREDICT  /  CHECK BOTH  /  EXPLAIN',font=font(36),fill='#9be9d3');d.text((55,540),'Three rounds. Six small checks. Your pace.',font=font(29),fill='#b6c9c9')
 else:
  d.multiline_text((55,155),'Stop flipping\nat random.',font=font(85),spacing=12,fill='#e5f1ec')
  for i,(title,body) in enumerate([('01 / PREDICT','What will this flip change?'),('02 / CHECK BOTH','What happened at each end?'),('03 / EXPLAIN','What will you try next?')]):
   y=480+i*245;d.line((55,y-25,945,y-25),fill='#4b7277',width=2);d.text((55,y),title,font=font(43),fill='#9be9d3');d.text((55,y+85),body,font=font(35),fill='#e5f1ec')
  d.multiline_text((55,1270),'A free companion practice sheet.\nNo timer. Help is welcome.',font=font(32),spacing=20,fill='#b6c9c9')
 im.save(r/'bridge-funnel'/name)
