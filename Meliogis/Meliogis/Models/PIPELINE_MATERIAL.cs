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
    
    public partial class PIPELINE_MATERIAL
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PIPELINE_MATERIAL()
        {
            this.PUMPSTATIONs = new HashSet<PUMPSTATION>();
        }
    
        public int OBJECTID { get; set; }
        public string NAME { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PUMPSTATION> PUMPSTATIONs { get; set; }
    }
}