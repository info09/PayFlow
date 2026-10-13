using Volo.Abp.Modularity;

namespace PayFlow.Books;

public abstract class BookAppService_Tests<TStartupModule> : PayFlowApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IBookAppService _bookAppService;

    protected BookAppService_Tests()
    {
        _bookAppService = GetRequiredService<IBookAppService>();
    }

}