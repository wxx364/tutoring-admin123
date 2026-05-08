import requests, re

r = requests.get('https://tutoring-admin.vercel.app', timeout=8)
html = r.text
js_files = re.findall(r'(?:src|href)="(/[^"]+\.js[^"]*)"', html)
print('JS files:', js_files[:5])
print('HTML length:', len(html))
for js in js_files[:3]:
    js_url = 'https://tutoring-admin.vercel.app' + js.strip('"')
    r2 = requests.get(js_url, timeout=8)
    print('Checking:', js[:60], '- size:', len(r2.text), '- has new:', 'OneOnOneAttendance' in r2.text)
