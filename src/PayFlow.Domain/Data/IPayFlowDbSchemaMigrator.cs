using System.Threading.Tasks;

namespace PayFlow.Data;

public interface IPayFlowDbSchemaMigrator
{
    Task MigrateAsync();
}
