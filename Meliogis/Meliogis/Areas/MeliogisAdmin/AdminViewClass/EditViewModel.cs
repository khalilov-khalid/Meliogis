using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Meliogis.Models;

namespace Meliogis.Areas.MeliogisAdmin.AdminViewClass
{    
    public class EditViewModel
    {
        public List<ACTIVITY> _activity { get; set; }
        public List<ASSIGMENT> _assigment { get; set; }
        public List<CHANNEL_TYPES> _types { get; set; }
        public List<CHANNEL> _source { get; set; }
        public List<COVER_TYPES> _covertypes { get; set; }
        public List<KIND> _kind { get; set; }
        public List<PROPERTY_TYPE> _propery_type { get; set; }
        public List<REGION> _regions { get; set; }
        public List<REGION> _villages { get; set; }
        public List<SIB> _sibs { get; set; }
        public List<TECHNICAL_TYPE> _technical { get; set; }
        public List<SECURITY_TYPE> _security { get; set; }
        public List<NETWORK_TYPE> _networks { get; set; }


        public CHANNEL _editedchannel { get; set; }
        public DRENAJ _editedDrenaj { get; set; }
        public DEVICE _editedDevice { get; set; }
    }
}