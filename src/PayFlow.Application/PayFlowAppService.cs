using PayFlow.Localization;
using Volo.Abp.Application.Services;

namespace PayFlow;

/* Inherit your application services from this class.
 */
public abstract class PayFlowAppService : ApplicationService
{
    protected PayFlowAppService()
    {
        LocalizationResource = typeof(PayFlowResource);
    }
}
