import requests, re

urls = [
    'https://tutoring-admin-ugl6.vercel.app',
    'https://tutoring-admin.vercel.app',
]
for url in urls:
    try:
        r = requests.get(url, timeout=8)
        html = r.text
        js_match = re.search(r'src="(/assets/[^"]+\.js)"', html)
        js_ref = js_match.group(1) if js_match else 'none'
        print('URL:', url)
        print('  Status:', r.status_code)
        print('  JS bundle:', js_ref)
        if js_ref != 'none':
            js_url = url + js_ref
            r2 = requests.get(js_url, timeout=8)
            has_new = 'OneOnOneAttendance' in r2.text
            print('  Has new pages:', has_new, '| JS size:', len(r2.text))
    except Exception as e:
        print('URL:', url, 'Error:', e)
