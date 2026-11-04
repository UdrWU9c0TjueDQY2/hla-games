from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
r=Path(__file__).parent
font=lambda n:ImageFont.truetype(str(r/'dm-serif-display.ttf'),n)
sans=lambda n:ImageFont.truetype(str(r/'archivo-800.ttf'),n)
for w,h,name in [(1200,630,'og.png'),(1000,1500,'pin-1.png')]:
 im=Image.new('RGB',(w,h),'#f6f2e7');d=ImageDraw.Draw(im)
 d.text((55,40),'SUMTHREAD / COMPANION PUZZLE 01',font=sans(23),fill='#175f53')
 if w>h:
  d.multiline_text((55,120),'Nine tiles.\nThree sums.\nOne thread.',font=font(77),spacing=1,fill='#20382f');gx,gy,s=760,140,105
  d.text((55,530),'Try it. Undo freely. Reveal the solution.',font=sans(25),fill='#80511b')
 else:
  d.multiline_text((55,140),'Nine tiles. Three sums.\nCan you find the route?',font=font(65),spacing=10,fill='#20382f');gx,gy,s=215,485,175
  d.text((55,1170),'TARGETS: 6, THEN 9, THEN 6',font=sans(34),fill='#80511b')
  d.multiline_text((55,1280),'Start at the top left. Move along edges.\nUse each tile once. No diagonals.',font=sans(28),spacing=15,fill='#20382f')
 for i,v in enumerate([1,2,3,3,2,4,1,2,3]):
  x=gx+(i%3)*s;y=gy+(i//3)*s;d.rounded_rectangle((x,y,x+s-10,y+s-10),radius=12,fill='#e8eddf',outline='#8eaa99',width=2);d.text((x+s*.33,y+s*.17),str(v),font=font(int(s*.52)),fill='#20382f')
 im.save(r/'sum-funnel'/name)
