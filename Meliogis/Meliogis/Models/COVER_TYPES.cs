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
    
    public partial class COVER_TYPES
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public COVER_TYPES()
        {
            this.CHANNELS = new HashSet<CHANNEL>();
            this.EXPLOITATION_ROAD = new HashSet<EXPLOITATION_ROAD>();
            this.RIVERBANDs = new HashSet<RIVERBAND>();
        }
    
        public int OBJECTID { get; set; }
        public string NAME { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CHANNEL> CHANNELS { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EXPLOITATION_ROAD> EXPLOITATION_ROAD { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RIVERBAND> RIVERBANDs { get; set; }
    }
}
