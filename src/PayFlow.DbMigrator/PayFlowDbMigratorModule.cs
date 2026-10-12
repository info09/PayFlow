using PayFlow.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace PayFlow.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PayFlowEntityFrameworkCoreModule),
    typeof(PayFlowApplicationContractsModule)
)]
public class PayFlowDbMigratorModule : AbpModule
{
}
