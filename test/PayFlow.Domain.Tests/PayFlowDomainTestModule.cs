using Volo.Abp.Modularity;

namespace PayFlow;

[DependsOn(
    typeof(PayFlowDomainModule),
    typeof(PayFlowTestBaseModule)
)]
public class PayFlowDomainTestModule : AbpModule
{

}
