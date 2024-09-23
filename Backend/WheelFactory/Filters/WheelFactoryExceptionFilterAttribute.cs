using Microsoft.AspNetCore.Mvc.Filters;

namespace WheelFactory.Filters
{
    public class WheelFactoryExceptionFilterAttribute:ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            base.OnException(context);
        }
    }
}
