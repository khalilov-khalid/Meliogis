using Meliogis.CopyModel;
using Meliogis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Meliogis.ViewModels
{
    public class IndexViewModel
    {
        public List<CopyREGIONS> _regions { get; set; }
        public List<COVER_TYPES> _covertypes { get; set; }
        public List<TECHNICAL_TYPE> _tehnicals { get; set; }
        public List<PROPERTY> _property { get; set; }
        public List<PROPERTY_TYPE> _propertytypes { get; set; }
        public List<ACTIVITY> _activity { get; set; }
        public List<KIND> _kind { get; set; }
        public List<PUMP_KIND> _pumkind { get; set; }
        public List<PUMP_TYPE> _pumtype { get; set; }
        public List<BRAND_OF_AGGREGATE> _brads { get; set; }
        public List<PIPELINE_MATERIAL> _materials { get; set; }
        public List<ASSIGMENT> _assigment { get; set; }
        public List<SECURITY_TYPE> _security { get; set; }
        public List<NETWORK_TYPE> _networktype { get; set; }
        public List<WELL_TYPE> _welltype { get; set; }
        public List<SIB> _sibs { get; set; }
        public List<CHANNEL_TYPES> _channeltype { get; set; }
    }
}