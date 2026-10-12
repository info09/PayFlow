using PayFlow.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace PayFlow.Permissions;

public class PayFlowPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PayFlowPermissions.GroupName);

        var booksPermission = myGroup.AddPermission(PayFlowPermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(PayFlowPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(PayFlowPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(PayFlowPermissions.Books.Delete, L("Permission:Books.Delete"));

        var authorsPermission = myGroup.AddPermission(PayFlowPermissions.Authors.Default, L("Permission:Authors"));
        authorsPermission.AddChild(PayFlowPermissions.Authors.Create, L("Permission:Authors.Create"));
        authorsPermission.AddChild(PayFlowPermissions.Authors.Edit, L("Permission:Authors.Edit"));
        authorsPermission.AddChild(PayFlowPermissions.Authors.Delete, L("Permission:Authors.Delete"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(PayFlowPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PayFlowResource>(name);
    }
}
