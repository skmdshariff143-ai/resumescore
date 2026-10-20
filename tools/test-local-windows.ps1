# Keep an unattended Windows test run active without changing saved power policy
# or preventing screen locking. Windows releases the request if this process exits.
param([switch]$Preview)
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class ResumeScoreTestPower {
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint flags);
}
'@
if ([ResumeScoreTestPower]::SetThreadExecutionState([uint32]2147483649) -eq 0) {
    throw 'Unable to request temporary system wakefulness for the test run.'
}
$testExitCode = 1
try {
    if ($Preview) {
        & node tools/run-preview-tests.mjs
    } else {
        & npm.cmd run test:e2e
    }
    $testExitCode = $LASTEXITCODE
} finally {
    [void][ResumeScoreTestPower]::SetThreadExecutionState([uint32]2147483648)
}
exit $testExitCode
