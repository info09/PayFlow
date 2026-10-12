using Volo.Abp.Modularity;

namespace PayFlow;

/* Inherit from this class for your domain layer tests. */
public abstract class PayFlowDomainTestBase<TStartupModule> : PayFlowTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
