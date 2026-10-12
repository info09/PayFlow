using Volo.Abp.Settings;

namespace PayFlow.Settings;

public class PayFlowSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(PayFlowSettings.MySetting1));
    }
}
