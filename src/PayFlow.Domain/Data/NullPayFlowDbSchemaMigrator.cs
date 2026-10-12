using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace PayFlow.Data;

/* This is used if database provider does't define
 * IPayFlowDbSchemaMigrator implementation.
 */
public class NullPayFlowDbSchemaMigrator : IPayFlowDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
