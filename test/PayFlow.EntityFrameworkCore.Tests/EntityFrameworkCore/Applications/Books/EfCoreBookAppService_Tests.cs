using PayFlow.Books;
using Xunit;

namespace PayFlow.EntityFrameworkCore.Applications.Books;

[Collection(PayFlowTestConsts.CollectionDefinitionName)]
public class EfCoreBookAppService_Tests : BookAppService_Tests<PayFlowEntityFrameworkCoreTestModule>
{

}