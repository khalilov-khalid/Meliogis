//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Meliogis.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class DRENAJ_SIBS
    {
        public int OBJECTID { get; set; }
        public Nullable<int> DRENAJ_ID { get; set; }
        public Nullable<int> SIBS_ID { get; set; }
    
        public virtual DRENAJ DRENAJ { get; set; }
        public virtual SIB SIB { get; set; }
    }
}
