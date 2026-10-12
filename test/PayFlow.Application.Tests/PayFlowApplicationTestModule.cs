using Volo.Abp.Modularity;

namespace PayFlow;

[DependsOn(
    typeof(PayFlowApplicationModule),
    typeof(PayFlowDomainTestModule)
)]
public class PayFlowApplicationTestModule : AbpModule
{

}
