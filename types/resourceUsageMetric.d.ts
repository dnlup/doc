export interface ResourceUsageMetric {
  /**
    * Cpu usage percentage
    */
   cpu: number,
   /**
     * Raw vaule returned by `process.resourceUsage()`
     */
   raw: {
     fsRead: number;
     fsWrite: number;
     involuntaryContextSwitches: number;
     ipcReceived: number;
     ipcSent: number;
     majorPageFault: number;
     maxRSS: number;
     minorPageFault: number;
     sharedMemorySize: number;
     signalsCount: number;
     swappedOut: number;
     systemCPUTime: number;
     unsharedDataSize: number;
     unsharedStackSize: number;
     userCPUTime: number;
     voluntaryContextSwitches: number;
   }
}
