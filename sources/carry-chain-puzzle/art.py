from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
r=Path(__file__).parent
font=lambda n:ImageFont.truetype(str(r/'archivo-800.ttf'),n)
for w,h,name in [(1200,630,'og.png'),(1000,1500,'pin-1.png')]:
 im=Image.new('RGB',(w,h),'#0b0820');d=ImageDraw.Draw(im)
 d.text((55,42),'NUMBER BEASTS / THE CARRY CHAIN',font=font(24),fill='#d8aeff')
 if w>h:
  d.multiline_text((55,110),'One number.\nThink two beasts ahead.',font=font(66),spacing=12,fill='#f6f2ff')
  d.text((55,350),'7 + 5 = 12',font=font(62),fill='#d2ff75');d.text((645,350),'2 + 8 = 10',font=font(62),fill='#ff9fdf')
  d.line((495,395,610,395),fill='#d8aeff',width=4)
  d.text((55,500),'Try four launches. See what carries on.',font=font(34),fill='#f6f2ff')
 else:
  d.multiline_text((55,140),'The biggest shot\nis not always\nthe cleanest.',font=font(70),spacing=16,fill='#f6f2ff')
  for y,title,body in [(510,'START WITH 7','7 + 5 = 12. Carry 2.'),(750,'USE THE CARRY','2 + 8 = 10. Both clear.'),(990,'COMPARE WITH 9','A leftover 2 spills back.')]:
   d.line((55,y-25,945,y-25),fill='#65517e',width=2);d.text((55,y),title,font=font(37),fill='#d2ff75');d.text((55,y+70),body,font=font(39),fill='#f6f2ff')
  d.text((55,1250),'Try the free rule illustration.',font=font(37),fill='#ff9fdf')
  d.text((55,1410),'HONEST LITTLE APPS / NUMBER BEASTS',font=font(23),fill='#d8aeff')
 im.save(r/'beasts-funnel'/name)
