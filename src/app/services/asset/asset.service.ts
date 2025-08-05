import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Asset, AssetCount } from '../../models/asset.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
// import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private apiUrl = environment.asset_apiBaseUrl;

  constructor(private http: HttpClient) { }

  createAsset(data: Partial<Asset>): Observable<Asset> {
    return this.http.post<Asset>(`${this.apiUrl}`, data);
  }
  getAllAssets() :Observable<Asset[]>{
    return this.http.get<Asset[]>(`${this.apiUrl}`);
  }

  getAssetCounts():Observable<AssetCount[]>  {
    return this.http.get<AssetCount[]>(`${this.apiUrl}/summary`);
  }

  updateAsset(id: string, data:Partial<Asset>): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/${id}`, data);
  }

  deleteAsset(id: string) : Observable<{message : string}> {
    return this.http.delete<{message : string}>(`${this.apiUrl}/${id}`);
  }

  getAvailableAssetsByCategory(category: string) :Observable<Asset[]>{
    return this.http.get<Asset[]>(`${this.apiUrl}/available/${category}`);
  }


}
