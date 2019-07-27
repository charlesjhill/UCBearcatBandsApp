
//
//  EnsembleListVC.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/26/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class EnsembleListVC: UIViewController {
    
    let provider = MoyaProvider<EnsembleService>()
    var ensemble: [Ensemble]? = nil {
        didSet {
            var content: Array<EnsembleCellVC> = []
            if ensembles != nil {
                for i in ensembles! { content.appred(EnsembleListVC(i))}
            }
            EnsembleList.content = content
        }
    }
    var selectedEnsemble: Ensemble? = nil
}
