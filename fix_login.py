path = r'c:\Users\santh\OneDrive\Pictures\Desktop\webathon\src\pages\LoginPage.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken string literal (raw apostrophe in single-quoted string) and add onboarding redirect
old_nav = "                    navigate('/dashboard');\n                } else {\n                    setError('Invalid email or password. Please register an account if you haven't already.');"
new_nav = "                    const onboardingDone = localStorage.getItem('onboardingComplete');\n                    navigate(onboardingDone ? '/dashboard' : '/onboarding');\n                } else {\n                    setError('Invalid credentials. Please register if you do not have an account.');"

# Also try Windows line endings
old_win = old_nav.replace('\n', '\r\n')
new_win = new_nav.replace('\n', '\r\n')

if old_win in content:
    content = content.replace(old_win, new_win)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('DONE (CRLF)')
elif old_nav in content:
    content = content.replace(old_nav, new_nav)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('DONE (LF)')
else:
    # Try a simpler fix - just replace the navigate line
    line_old = "                    navigate('/dashboard');"
    line_new = "                    const onboardingDone = localStorage.getItem('onboardingComplete');\n                    navigate(onboardingDone ? '/dashboard' : '/onboarding');"
    if line_old in content:
        content = content.replace(line_old, line_new, 1)  # only first occurrence (in user login block)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('DONE (LINE REPLACE)')
    else:
        print('NOT FOUND')
