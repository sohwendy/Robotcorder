# Change Log

## [0.4.0] 22 Sept 2018
- Add hidden option to customise the locators
- Bump up devDependencies versions

## [0.3.0] 24 Oct 2017
- Add Pause feature
- Fix Scan bug
- Minor update to analytic tracking on version

## [0.2.0] 18 Oct 2017
- Add Copy feature to allow copying of script into clipboard
- Closes the browser after the test
- Change to 4 spacing. Originally using 2 spaces
- Major refactor include adding test and eslint
- Use 'npm run export' as alternative to using './script/export.command'
- Skip addition of verification of element before browser is open
- Add Travis CI

## [0.1.9] 19 Jun 2017
- Add Sleep 3s into Settings to slow down action execution
- Add Check Element into Settings to verify presence of element
- Set all_frames=true in manifest to listen to all the frames. Possible performance degradation for page with many elements
- Remove all tabs permissions to prevent recording on other tabs.
