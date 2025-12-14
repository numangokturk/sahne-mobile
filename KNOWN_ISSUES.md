# SAHNE Mobile - Known Issues & Future Improvements

## 🐛 Bugs to Fix

### High Priority
1. **chef/[id] tab still visible** - Bottom navigation still shows "chef/[id]" tab on the right side. Need to properly hide this dynamic route from tab bar.

2. **Onboarding not showing for new users** - The 3-slide onboarding screen should show only on first app launch, but it's not appearing. AsyncStorage check may not be working correctly.

3. **"Welcome back" always shows** - Even for first-time users or after clearing app data, "Welcome back" message appears instead of "Welcome".

### Medium Priority
4. **Cover photo cropping** - Chef detail page cover photo is not fully visible, image appears cropped at top.

5. **Dark mode toggle not working** - Settings toggle doesn't switch between light/dark mode properly.

6. **SafeAreaView deprecation warning** - Need to replace deprecated SafeAreaView with 'react-native-safe-area-context'.

### Low Priority
7. **Onboarding emojis** - Replace cartoon emojis with premium photos/videos for a more professional look.

8. **Layout warning** - "No route named 'chef' exists in nested children" warning in console.

## 📝 Notes for Fine-tuning

- Cover image height may need adjustment per device
- Consider moving chef/[id] route outside of (client) folder to a separate Stack navigator
- Review AsyncStorage onboarding flag logic
- Test on multiple device sizes for responsive issues

## 🎯 To Address After Phase 7

These issues will be addressed during the final polish phase after core functionality is complete.
