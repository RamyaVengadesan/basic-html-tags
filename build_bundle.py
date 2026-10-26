"""Inlines css/js into one self-contained page (used for publishing as an artifact)."""
import re,sys
h=open('index.html').read()
css=open('css/styles.css').read()
tags=open('js/tags.js').read(); app=open('js/app.js').read()
head=re.search(r'<head>(.*?)</head>',h,re.S).group(1)
head=re.sub(r'\s*<meta charset[^>]*>|\s*<meta name="viewport"[^>]*>|\s*<link rel="stylesheet" href="css/styles.css">','',head)
body=re.search(r'<body>(.*?)</body>',h,re.S).group(1)
body=re.sub(r'\s*<script src="js/[^"]+"></script>','',body)
out=head+f'\n<style>\n{css}\n</style>\n'+body+f'\n<script>\n{tags}\n</script>\n<script>\n{app}\n</script>\n'
open(sys.argv[1],'w').write(out)
