using Volo.Abp.Modularity;

namespace PayFlow;

public abstract class PayFlowApplicationTestBase<TStartupModule> : PayFlowTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
