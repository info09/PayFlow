using Microsoft.Extensions.Localization;
using PayFlow.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace PayFlow;

[Dependency(ReplaceServices = true)]
public class PayFlowBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<PayFlowResource> _localizer;

    public PayFlowBrandingProvider(IStringLocalizer<PayFlowResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
