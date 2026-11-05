from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from html import escape
from fractions import Fraction

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'src/cash-empire-clicker/idle-game-offline-earnings-calculator'
W, H = 1200, 1520
BG, INK, MUTED, GOLD, CARD, GREEN = '#07152e', '#f5f7ff', '#c1cce1', '#f4c85b', '#122947', '#8ee5b5'
img = Image.new('RGB', (W,H), BG)
d = ImageDraw.Draw(img)
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc"><title id="title">Use the extra income, not the new total</title><desc id="desc">Two fictional upgrades: A costs120 tokens and adds4 per second, recovering its cost in30 seconds. B costs180 and adds9, recovering its cost in20 seconds. C costs300 and adds10, matching A at30 seconds. Full equivalent text and formulas are on the parent page.</desc><rect width="1200" height="1520" fill="{BG}"/>']
fontroot=Path('/usr/share/fonts/truetype/dejavu')
def rect(x,y,w,h,fill,r=0):
    d.rounded_rectangle((x,y,x+w,y+h),radius=r,fill=fill)
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>')
def line(x1,y1,x2,y2,color,width=2):
    d.line((x1,y1,x2,y2),fill=color,width=width)
    parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>')
def text(x,y,t,size=30,bold=False,color=INK):
    font=ImageFont.truetype(str(fontroot/('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size)
    bbox=d.textbbox((x,y),t,font=font)
    assert bbox[2] < W-34, (t,bbox)
    d.text((x,y),t,font=font,fill=color)
    parts.append(f'<text x="{x}" y="{y+size}" fill="{color}" font-family="DejaVu Sans, sans-serif" font-weight="{700 if bold else 400}" font-size="{size}">{escape(t)}</text>')

text(64,38,'HONEST LITTLE APPS / FICTIONAL GAME MATH',25,True,GOLD)
text(64,96,'Use the extra income.',60,True)
text(64,169,'Not the new total.',60,True)
text(64,264,'Payback time = cost ÷ extra tokens per second',34,True,GREEN)
text(64,316,'Both examples start at 10 tokens/s. Rates stay constant.',28,color=MUTED)

for x,name,cost,new,extra,pay in [(64,'UPGRADE A',120,14,4,30),(624,'UPGRADE B',180,19,9,20)]:
    rect(x,390,512,360,CARD,22)
    text(x+28,414,name,29,True,GOLD)
    text(x+28,467,f'Cost: {cost} tokens',32,True)
    text(x+28,522,f'New total: {new} tokens/s',28)
    text(x+28,566,f'Extra: {new} − 10 = {extra} tokens/s',27)
    text(x+28,638,f'{cost} ÷ {extra} = {pay} seconds',34,True,GREEN)

text(64,792,'TIME TO RECOVER THE UPGRADE COST',25,True,GOLD)
for y,name,pay,width in [(860,'A',30,840),(938,'B',20,560)]:
    text(64,y-1,name,32,True)
    rect(122,y,width,42,GREEN if name=='B' else '#95aed4',8)
    text(142+width,y+2,f'{pay} s',26,True)
text(64,1023,'B costs more, but pays back 10 seconds sooner.',32,True)

line(64,1102,1136,1102,'#46607e')
text(64,1136,'THE TOTAL-RATE TRAP',25,True,GOLD)
text(64,1183,'120 ÷ 14 and 180 ÷ 19 include income you already had.',27)
text(64,1225,'They give the wrong comparison for the upgrade alone.',27)
text(64,1295,'EQUAL PAYBACK DOES NOT MEAN EQUAL COST',25,True,GOLD)
text(64,1342,'A: 120 ÷ 4 = 30 s.  C: 300 ÷ 10 = 30 s.',29,True)
text(64,1393,'Same payback; different upfront tokens and extra rate.',27)
text(64,1462,'Original Cash Empire companion • not native gameplay • no real-money value',23,color=MUTED)
parts.append('</svg>')
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'incremental-payback-card.svg').write_text('\n'.join(parts)+'\n')
img.save(OUT/'incremental-payback-card.png',optimize=True)

assert Fraction(120,14-10)==30
assert Fraction(180,19-10)==20
assert Fraction(300,20-10)==30
assert Fraction(120,14)<Fraction(180,19) # Wrong total-rate method chooses A.
assert 4*15-120==-60 and 9*15-180==-45
assert 4*30-120==0 and 9*30-180==90
assert 4*60-120==120 and 10*60-300==300
print('7 exact arithmetic/counterexample checks passed; SVG/PNG generated.')
