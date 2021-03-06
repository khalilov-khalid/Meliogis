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
    
    public partial class PROPERTY
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PROPERTY()
        {
            this.ARTEZIAN_WELL = new HashSet<ARTEZIAN_WELL>();
            this.BUILDINGS = new HashSet<BUILDING>();
            this.CHANNELS = new HashSet<CHANNEL>();
            this.DEVICEs = new HashSet<DEVICE>();
            this.DRENAJs = new HashSet<DRENAJ>();
            this.EXPLOITATION_ROAD = new HashSet<EXPLOITATION_ROAD>();
            this.PUMPSTATIONs = new HashSet<PUMPSTATION>();
            this.RIVERBANDs = new HashSet<RIVERBAND>();
            this.USERS = new HashSet<USER>();
            this.WELLs = new HashSet<WELL>();
            this.WINTERPASTURES = new HashSet<WINTERPASTURE>();
        }
    
        public int OBJECTID { get; set; }
        public string NAME { get; set; }
        public Nullable<int> REGION_ID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ARTEZIAN_WELL> ARTEZIAN_WELL { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BUILDING> BUILDINGS { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CHANNEL> CHANNELS { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DEVICE> DEVICEs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DRENAJ> DRENAJs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EXPLOITATION_ROAD> EXPLOITATION_ROAD { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PUMPSTATION> PUMPSTATIONs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RIVERBAND> RIVERBANDs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<USER> USERS { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<WELL> WELLs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<WINTERPASTURE> WINTERPASTURES { get; set; }
    }
}
