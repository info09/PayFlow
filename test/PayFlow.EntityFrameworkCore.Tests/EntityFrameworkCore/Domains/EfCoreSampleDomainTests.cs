using PayFlow.Samples;
using Xunit;

namespace PayFlow.EntityFrameworkCore.Domains;

[Collection(PayFlowTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<PayFlowEntityFrameworkCoreTestModule>
{

}
