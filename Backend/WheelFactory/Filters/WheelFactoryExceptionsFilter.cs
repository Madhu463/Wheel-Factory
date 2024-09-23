using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;

namespace WheelFactory.Filters
{
    public class WheelFactoryExceptionsFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
           if(context.Exception is SqlException)
            {

            }
        }
    }
}
