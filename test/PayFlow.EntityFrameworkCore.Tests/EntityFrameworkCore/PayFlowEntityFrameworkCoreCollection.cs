using Xunit;

namespace PayFlow.EntityFrameworkCore;

[CollectionDefinition(PayFlowTestConsts.CollectionDefinitionName)]
public class PayFlowEntityFrameworkCoreCollection : ICollectionFixture<PayFlowEntityFrameworkCoreFixture>
{

}
