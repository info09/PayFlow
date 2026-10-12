using PayFlow.Samples;
using Xunit;

namespace PayFlow.EntityFrameworkCore.Applications;

[Collection(PayFlowTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<PayFlowEntityFrameworkCoreTestModule>
{

}
