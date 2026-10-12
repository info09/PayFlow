using PayFlow.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace PayFlow.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class PayFlowController : AbpControllerBase
{
    protected PayFlowController()
    {
        LocalizationResource = typeof(PayFlowResource);
    }
}
